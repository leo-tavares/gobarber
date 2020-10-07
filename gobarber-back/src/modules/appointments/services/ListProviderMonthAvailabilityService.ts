// Service will always have a unique method inside of it
// It will never have more than one method

import { getDaysInMonth, getDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    // const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // const eachDayArray = Array.from(
    //   { length: numberOfDaysInMonth },
    //   (value, index) => index + 1,
    // );

    const eachDayArray = this.createArrayOfDaysInMonth(year, month);

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
      //  08:30 09:30 10:30 11:30 12:30 13:30 14:30 15:30 16:30
      // 8 9 10 11 12 13 14 15 16 17
    });

    return availability;
  }

  private createArrayOfDaysInMonth(year: number, month: number): number[] {
    const numberOfDaysInMonth = this.getNumberOfDaysInMonth(year, month);

    const daysInMonthOfYear = Array.from(
      { length: numberOfDaysInMonth },
      (value, index) => index + 1,
    );

    return daysInMonthOfYear;
  }

  private getNumberOfDaysInMonth(year: number, month: number): number {
    return getDaysInMonth(new Date(year, month - 1));
  }
}

export default ListProviderMonthAvailabilityService;
